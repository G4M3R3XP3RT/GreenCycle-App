package com.project.greencycle.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.project.greencycle.dto.ChatRequest;
import com.project.greencycle.dto.ChatResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatbotService {

    private ChatClient chatClient;

    public ChatbotService(ChatClient.Builder builder) {
        this.chatClient = builder
                // prompt to initialize chatbot
                .defaultSystem(
                        "Tu es un assistant écologique pour l'application GreenCycle. Ton rôle est d'aider les citoyens à savoir comment trier certains objets complexes et comprendre leur impact écologique. Tu dois savoir que sur GreenCycle, chaque kilogramme de déchet recyclé rapporte 10 GreenPoints au citoyen. Pour recycler avec l'application, un collecteur de déchets désigné viendra chez l'utilisateur pour récupérer ses déchets. Tes réponses doivent être concises, bienveillantes, et inciter l'utilisateur à planifier une collecte sur l'application.")
                .build();
    }

    public ChatResponse askQuestion(ChatRequest request) {
        String response = chatClient.prompt()
                .user(request.getMessage())
                .call()
                .content();

        return ChatResponse.builder()
                .reponse(response)
                .build();
    }
}
