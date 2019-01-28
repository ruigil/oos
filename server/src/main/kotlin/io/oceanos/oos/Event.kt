package io.oceanos.oos

import org.springframework.data.cassandra.core.mapping.PrimaryKey
import org.springframework.data.cassandra.core.mapping.Table

@Table
data class Event(@PrimaryKey val id : String, val title: String, val timestamp: Int)

