package io.oceanos.oos


import org.springframework.stereotype.Component
import org.springframework.stereotype.Repository
import org.springframework.web.reactive.function.server.*
import org.springframework.web.reactive.function.server.ServerResponse.ok
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.publisher.toMono
import java.time.Duration

@Component
class EventHandler(private val repository: EventRepository) {

    fun getAll(request: ServerRequest): Mono<ServerResponse> {
        val interval = Flux.interval(Duration.ofSeconds(1))

        val books = repository.findAll()
        return ok().bodyToServerSentEvents(Flux.zip(interval, books).map({ it.t2 }))
    }

    fun getEvent(request: ServerRequest): Mono<ServerResponse> {
        val title = request.pathVariable("title")

        //return ok().body(repository.findByTitle(title))
        return ok().body(Event("id","title",0).toMono())
    }

    fun addEvent(request: ServerRequest): Mono<ServerResponse> {
        val event = request.bodyToMono<Event>()

        return ok().body(repository.saveAll(event).toMono())
    }
}