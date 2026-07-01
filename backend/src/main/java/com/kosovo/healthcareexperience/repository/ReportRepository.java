package com.kosovo.healthcareexperience.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kosovo.healthcareexperience.entity.Report;
import com.kosovo.healthcareexperience.enums.ReportStatus;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByStatus(ReportStatus status);
    long countByStatus(ReportStatus status);
}
