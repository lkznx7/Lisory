package com.lisory.backend.auth.services;

import com.lisory.backend.auth.dto.AuthRequest;
import com.lisory.backend.auth.dto.AuthResponse;
import com.lisory.backend.auth.entity.AuthEntity;
import com.lisory.backend.auth.exception.EmailAlreadyExistsException;
import com.lisory.backend.auth.exception.InvalidCredentialsException;
import com.lisory.backend.auth.repository.AuthRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;

    public AuthenticationService(AuthRepository authRepository, PasswordEncoder passwordEncoder, TokenProvider tokenProvider) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public void register(AuthRequest request) {
        if (authRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }

        AuthEntity entity = new AuthEntity(request.email(), passwordEncoder.encode(request.password()));
        authRepository.save(entity);
    }

    public AuthResponse authenticate(AuthRequest request) {
        AuthEntity user = authRepository.findByEmail(request.email())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user.getEmail());
        return new AuthResponse(token);
    }
}
