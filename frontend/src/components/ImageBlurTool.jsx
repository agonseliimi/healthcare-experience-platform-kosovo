import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Canvas-based image blur (pixelation) tool using a brush/painting UX.
 *
 * The user paints over sensitive areas with a circular brush. The pixelation
 * is prerendered off-screen and drawn onto the canvas using the brush strokes
 * as a mask.
 */
function ImageBlurTool({ file, onConfirm, onCancel }) {
  const { t } = useTranslation()
  const canvasRef = useRef(null)
  
  // Offscreen canvases for fast pixelation masking
  const pristineCanvasRef = useRef(null)
  const pixelatedCanvasRef = useRef(null)

  const [loaded, setLoaded] = useState(false)
  
  // Brush state
  const [brushSize, setBrushSize] = useState(10)
  const [strokes, setStrokes] = useState([]) // Array of strokes, each is an array of points
  const [currentStroke, setCurrentStroke] = useState(null)
  
  // Cursor state
  const [cursorPos, setCursorPos] = useState(null)
  const [isHovering, setIsHovering] = useState(false)

  // Scale factor: canvas intrinsic size (image size) vs CSS size
  const scaleRef = useRef(1)

  const toImageCoords = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * scaleRef.current,
      y: (clientY - rect.top) * scaleRef.current,
    }
  }, [])

  // Setup offscreen canvases
  useEffect(() => {
    if (!file) return
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      canvas.width = img.width
      canvas.height = img.height

      // 1. Pristine image
      const pCanvas = document.createElement('canvas')
      pCanvas.width = img.width
      pCanvas.height = img.height
      const pCtx = pCanvas.getContext('2d')
      pCtx.drawImage(img, 0, 0)
      pristineCanvasRef.current = pCanvas

      // 2. Pre-pixelated image
      const xCanvas = document.createElement('canvas')
      xCanvas.width = img.width
      xCanvas.height = img.height
      const xCtx = xCanvas.getContext('2d')
      
      const blockSize = 12
      const smallW = Math.ceil(img.width / blockSize)
      const smallH = Math.ceil(img.height / blockSize)
      
      const tmpCanvas = document.createElement('canvas')
      tmpCanvas.width = smallW
      tmpCanvas.height = smallH
      const tmpCtx = tmpCanvas.getContext('2d')
      tmpCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, smallW, smallH)
      
      xCtx.imageSmoothingEnabled = false
      // Scale back up by exact blockSize to prevent sub-pixel shifting (aspect ratio distortion)
      xCtx.drawImage(tmpCanvas, 0, 0, smallW, smallH, 0, 0, smallW * blockSize, smallH * blockSize)
      pixelatedCanvasRef.current = xCanvas

      // Initial scale calculation
      const rect = canvas.getBoundingClientRect()
      scaleRef.current = img.width / rect.width

      setLoaded(true)
    }
    img.src = URL.createObjectURL(file)
    return () => URL.revokeObjectURL(img.src)
  }, [file])

  // Recalculate scale on resize
  useEffect(() => {
    function handleResize() {
      if (canvasRef.current && pristineCanvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        scaleRef.current = pristineCanvasRef.current.width / rect.width
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Redraw the canvas
  const redraw = useCallback((completedStrokes, activeStroke) => {
    const canvas = canvasRef.current
    if (!canvas || !pristineCanvasRef.current || !pixelatedCanvasRef.current) return
    const ctx = canvas.getContext('2d')

    // Start with pristine image
    ctx.drawImage(pristineCanvasRef.current, 0, 0)

    const allStrokes = [...completedStrokes]
    if (activeStroke) allStrokes.push(activeStroke)
    if (allStrokes.length === 0) return

    // Create a mask for the strokes
    const maskCanvas = document.createElement('canvas')
    maskCanvas.width = canvas.width
    maskCanvas.height = canvas.height
    const maskCtx = maskCanvas.getContext('2d')

    maskCtx.lineCap = 'round'
    maskCtx.lineJoin = 'round'

    allStrokes.forEach(stroke => {
      if (stroke.length === 0) return
      maskCtx.beginPath()
      for (let i = 0; i < stroke.length; i++) {
        const pt = stroke[i]
        maskCtx.lineWidth = pt.r * 2
        if (i === 0) {
          maskCtx.moveTo(pt.x, pt.y)
          maskCtx.lineTo(pt.x, pt.y) // draw dot if single point
        } else {
          maskCtx.lineTo(pt.x, pt.y)
        }
      }
      maskCtx.stroke()
    })

    // Draw pixelated image only inside the stroke mask
    maskCtx.globalCompositeOperation = 'source-in'
    maskCtx.drawImage(pixelatedCanvasRef.current, 0, 0)

    // Draw the masked pixelation over the main canvas
    ctx.drawImage(maskCanvas, 0, 0)
  }, [])

  useEffect(() => {
    if (loaded) redraw(strokes, currentStroke)
  }, [loaded, strokes, currentStroke, redraw])

  // Brush sizing via mouse wheel
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const onWheel = (e) => {
      e.preventDefault()
      setBrushSize(prev => {
        const newSize = prev - Math.sign(e.deltaY) * 2
        return Math.max(5, Math.min(newSize, 30))
      })
    }
    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', onWheel)
  }, [loaded])

  // Event handlers
  function handlePointerDown(e) {
    if (e.button !== 0 && e.type !== 'touchstart') return
    e.preventDefault()
    const { x, y } = toImageCoords(e)
    setCurrentStroke([{ x, y, r: brushSize * scaleRef.current }])
  }

  function handlePointerMove(e) {
    if (isHovering && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      setCursorPos({ x: clientX - rect.left, y: clientY - rect.top })
    }

    if (!currentStroke) return
    e.preventDefault()
    const { x, y } = toImageCoords(e)
    setCurrentStroke(prev => [...prev, { x, y, r: brushSize * scaleRef.current }])
  }

  function handlePointerUp(e) {
    if (!currentStroke) return
    e.preventDefault()
    setStrokes(prev => [...prev, currentStroke])
    setCurrentStroke(null)
  }

  function handleConfirm() {
    const canvas = canvasRef.current
    if (!canvas) return
    const isPng = file.type === 'image/png'
    const mimeType = isPng ? 'image/png' : 'image/jpeg'
    const quality = isPng ? undefined : 0.92

    canvas.toBlob(blob => {
      if (!blob) return
      const ext = isPng ? '.png' : '.jpg'
      const baseName = file.name.replace(/\.[^.]+$/, '')
      onConfirm(blob, baseName + ext)
    }, mimeType, quality)
  }

  return (
    <div className="blur-tool-overlay">
      <div className="blur-tool">
        <div className="blur-tool-header">
          <h2 className="blur-tool-title">{t('blurTool.title')}</h2>
          <p className="blur-tool-instruction">{t('blurTool.instruction')}</p>
        </div>

        <div className="blur-tool-controls" style={{ padding: '0 24px 12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text)' }}>
            Brush Size: <strong>{brushSize}px</strong>
            <input 
              type="range" 
              min="5" 
              max="30" 
              value={brushSize} 
              onChange={e => setBrushSize(Number(e.target.value))} 
              style={{ width: '150px' }}
            />
          </label>
        </div>

        <div className="blur-tool-canvas-wrap">
          <div style={{ position: 'relative', display: 'flex', borderRadius: 'var(--radius)', border: '2px solid var(--border)', overflow: 'hidden' }}>
            {isHovering && cursorPos && (
              <div 
                className="brush-cursor" 
                style={{
                  width: brushSize * 2,
                  height: brushSize * 2,
                  left: cursorPos.x,
                  top: cursorPos.y
                }}
              />
            )}
            <canvas
              ref={canvasRef}
              className="blur-tool-canvas"
              style={{ border: 'none', borderRadius: 0 }}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={(e) => {
                setIsHovering(false)
                handlePointerUp(e)
              }}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
              onTouchCancel={handlePointerUp}
            />
          </div>
          {!loaded && <div className="blur-tool-loading">{t('blurTool.loading', 'Loading…')}</div>}
        </div>

        <div className="blur-tool-actions">
          <div className="blur-tool-actions-left">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setStrokes(prev => prev.slice(0, -1))} disabled={strokes.length === 0}>
              ↩ {t('blurTool.undo')}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setStrokes([])} disabled={strokes.length === 0}>
              ✕ {t('blurTool.clearAll')}
            </button>
          </div>
          <div className="blur-tool-actions-right">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
              {t('blurTool.cancel')}
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleConfirm} disabled={!loaded}>
              ✓ {t('blurTool.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageBlurTool
