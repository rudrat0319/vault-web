package vaultWeb.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PollResponseDto {
    private Long id;
    private String question;
    private boolean isAnonymous;
    private List<OptionResultDto> options;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OptionResultDto {
        private Long id;
        private String text;
        private int voteCount;
        private List<String> voters;
    }
}
