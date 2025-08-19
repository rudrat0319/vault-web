package vaultWeb.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PollRequestDto {
    @NotNull(message = "Question must not be null")
    private String question;
    private Date deadline;
    private boolean isAnonymous;

    @NotNull(message = "Options must not be null")
    @Size(min = 2, message = "A poll must have at least two options")
    private List<String> options;
}
