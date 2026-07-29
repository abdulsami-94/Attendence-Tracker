package com.attendance.attendance_api.exception;

import com.attendance.attendance_api.dto.ErrorResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice // catches exceptions thrown by any @RestController, app-wide
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuth(AuthenticationException ex) {
        // don't say "wrong password" vs "no such user" — that tells an attacker which emails exist
        return build(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(DataIntegrityViolationException ex) {
        return build(HttpStatus.CONFLICT, "Email already registered");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleBadArgument(IllegalArgumentException ex) {
        // this is what fires when Role.valueOf() gets sent garbage like "ADMIN"
        return build(HttpStatus.BAD_REQUEST, "Invalid request: " + ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        ex.printStackTrace(); // logged server-side only; swap for a real logger eventually
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong");
    }

    private ResponseEntity<ErrorResponse> build(HttpStatus status, String message) {
        return ResponseEntity.status(status)
                .body(new ErrorResponse(message, status.value(), System.currentTimeMillis()));
    }
}