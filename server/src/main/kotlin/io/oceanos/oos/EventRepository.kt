package io.oceanos.oos

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux

interface EventRepository: ReactiveCrudRepository<Event, String> {
    fun findByTitle(title: String): Flux<Event>
}