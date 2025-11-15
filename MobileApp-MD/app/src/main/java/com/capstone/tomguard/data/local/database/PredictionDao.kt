package com.capstone.tomguard.data.local.database

import androidx.lifecycle.LiveData
import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query

@Dao
interface PredictionDao {

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    fun insert(prediction: Prediction)

    @Query("SELECT * from prediction ORDER BY id ASC")
    fun getAllPredictions(): LiveData<List<Prediction>>
}