package io.oceanos.oos

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class OosApplication

fun main(args: Array<String>) {
    runApplication<OosApplication>(*args)
}
