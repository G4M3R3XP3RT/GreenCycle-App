package com.project.greencycle;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BcryptHelper {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("securePass123 -> " + encoder.encode("securePass123"));
        System.out.println("SuperSecurePass754@-& -> " + encoder.encode("SuperSecurePass754@-&"));
        System.out.println("pass456 -> " + encoder.encode("pass456"));
        System.out.println("adminPass789 -> " + encoder.encode("adminPass789"));
        System.out.println("rootAdmin -> " + encoder.encode("rootAdmin"));
    }
}
