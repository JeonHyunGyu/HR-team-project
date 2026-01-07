package boot.team.hr.min.account.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // 기본 로그인 폼 비활성화
                .formLogin(form -> form.disable())

                // 기본 로그아웃도 같이 끔 (선택)
                .logout(logout -> logout.disable())

                // CSRF 일단 끔 (React 테스트용)
                .csrf(csrf -> csrf.disable())

                // 모든 요청 허용 (일단 막지 않음)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
