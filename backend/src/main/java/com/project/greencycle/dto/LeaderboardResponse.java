package com.project.greencycle.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LeaderboardResponse {
    private List<UserScoreDTO> top10;
    private UserScoreDTO currentUser;
}
