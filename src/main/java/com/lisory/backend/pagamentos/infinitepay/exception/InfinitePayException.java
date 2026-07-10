package com.lisory.backend.pagamentos.infinitepay.exception;

public class InfinitePayException extends RuntimeException {
    private final String errorCode;

    public InfinitePayException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public InfinitePayException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "UNKNOWN_ERROR";
    }

    public String getErrorCode() {
        return errorCode;
    }
}
