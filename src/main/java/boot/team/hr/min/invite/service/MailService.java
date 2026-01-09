package boot.team.hr.min.invite.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    public void sendInviteMail(String toEmail, String link) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[HR] 사원 초대 메일");
        message.setText(
                "HR 시스템 초대 메일입니다.\n\n" +
                        "아래 링크를 클릭해 가입을 완료해주세요.\n\n" +
                        link
        );

        mailSender.send(message);
    }
}