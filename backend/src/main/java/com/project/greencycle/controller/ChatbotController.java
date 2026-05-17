package com.project.greencycle.controller;

import org.springframework.beans.factory.annotation.Autowired;

import com.project.greencycle.dto.ChatRequest;
import com.project.greencycle.dto.ChatResponse;
import com.project.greencycle.service.ChatbotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<ChatResponse> askQuestion(@Valid @RequestBody ChatRequest request) {
        return ResponseEntity.ok(chatbotService.askQuestion(request));
    }
}
