package com.roomroot.backend.message.dto;

import jakarta.validation.constraints.NotBlank;

public class MessageRequest {

    @NotBlank(message = "Message content is required")
    private String content;

    public MessageRequest() {
    }

    public MessageRequest(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
