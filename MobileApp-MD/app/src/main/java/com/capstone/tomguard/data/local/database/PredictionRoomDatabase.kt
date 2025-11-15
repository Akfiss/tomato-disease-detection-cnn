package com.capstone.tomguard.data.local.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [Prediction::class], version = 1)
abstract class PredictionRoomDatabase : RoomDatabase() {
    abstract fun predictionsDao(): PredictionDao

    companion object {
        @Volatile
        private var INSTANCE: PredictionRoomDatabase? = null
        @JvmStatic
        fun getDatabase(context: Context): PredictionRoomDatabase {
            if (INSTANCE == null) {
                synchronized(PredictionRoomDatabase::class.java) {
                    INSTANCE = Room.databaseBuilder(context.applicationContext,
                        PredictionRoomDatabase::class.java, "prediction_database")
                        .build()
                }
            }
            return INSTANCE as PredictionRoomDatabase
        }
    }
}