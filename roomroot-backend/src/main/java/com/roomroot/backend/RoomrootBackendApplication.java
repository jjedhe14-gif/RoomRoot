package com.roomroot.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@SpringBootApplication
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class RoomrootBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(RoomrootBackendApplication.class, args);
	}

}
