package boot.team.hr.min.account.controller;

import boot.team.hr.min.account.dto.AccountDTO;
import boot.team.hr.min.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/signup")
    public ResponseEntity<?> adminSignUp(@RequestBody AccountDTO request) {
        Long adminId = accountService.adminSignUp(request);
        return ResponseEntity.ok(adminId);
    }
}
