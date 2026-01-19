
package com.justsearch.backend.service.Authentication;
import org.springframework.http.ResponseEntity;
import com.justsearch.backend.dto.SignInDto;
import com.justsearch.backend.dto.SignupRequestDto; 
import com.justsearch.backend.dto.TokenResponseDto;
public interface AuthService {

    void userSignUp(SignupRequestDto signUpRequest);

    ResponseEntity<?> userSignIn(SignInDto request);

    ResponseEntity<TokenResponseDto> refresh(String refreshToken);

    void logout(String refreshToken);

    void verifyEmail(String token);
}