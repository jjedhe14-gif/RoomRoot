package com.roomroot.backend.admin.dto;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Read-only platform/system health summary. Contains no secrets: no database
 * credentials, JWT secrets or raw configuration values are ever exposed.
 */
public class SystemOverviewResponse {

    private String service;
    private String status;
    private String databaseStatus;
    private String applicationVersion;
    private String apiVersion;
    private String javaVersion;
    private LocalDateTime serverTime;
    private Map<String, Long> recordCounts = new LinkedHashMap<>();

    public SystemOverviewResponse() {
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDatabaseStatus() {
        return databaseStatus;
    }

    public void setDatabaseStatus(String databaseStatus) {
        this.databaseStatus = databaseStatus;
    }

    public String getApplicationVersion() {
        return applicationVersion;
    }

    public void setApplicationVersion(String applicationVersion) {
        this.applicationVersion = applicationVersion;
    }

    public String getApiVersion() {
        return apiVersion;
    }

    public void setApiVersion(String apiVersion) {
        this.apiVersion = apiVersion;
    }

    public String getJavaVersion() {
        return javaVersion;
    }

    public void setJavaVersion(String javaVersion) {
        this.javaVersion = javaVersion;
    }

    public LocalDateTime getServerTime() {
        return serverTime;
    }

    public void setServerTime(LocalDateTime serverTime) {
        this.serverTime = serverTime;
    }

    public Map<String, Long> getRecordCounts() {
        return recordCounts;
    }

    public void setRecordCounts(Map<String, Long> recordCounts) {
        this.recordCounts = recordCounts;
    }
}
