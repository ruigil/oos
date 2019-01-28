package io.oceanos.oos

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import reactor.core.publisher.Flux
import java.util.*

@SpringBootApplication
class OosApplication {
    @Bean
        fun init(eventRepository: EventRepository) = CommandLineRunner {
            eventRepository.deleteAll().thenMany(
                    Flux.just("Hello", "Beautiful", "World")
                            .map { title -> Event(UUID.randomUUID().toString(), title, 0) }
                            .flatMap(eventRepository::save))
                    .thenMany(eventRepository.findAll())
                    .subscribe(System.out::println)
    }    
}

fun main(args: Array<String>) {
    runApplication<OosApplication>(*args)
}
