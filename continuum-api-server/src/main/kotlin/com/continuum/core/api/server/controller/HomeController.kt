package com.continuum.core.api.server.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/")
class HomeController {
    @GetMapping
    fun home(): ResponseEntity<Void> {
        return ResponseEntity.status(302).header("Location", "/swagger-ui/index.html").build()
    }
}