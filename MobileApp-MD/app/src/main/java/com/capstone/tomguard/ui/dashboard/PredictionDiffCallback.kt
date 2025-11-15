package com.capstone.tomguard.ui.dashboard

import androidx.recyclerview.widget.DiffUtil
import com.capstone.tomguard.data.local.database.Prediction

class PredictionDiffCallback(private val oldPredictionList: List<Prediction>, private val newPredictionList: List<Prediction>) : DiffUtil.Callback() {

    override fun getOldListSize(): Int = oldPredictionList.size

    override fun getNewListSize(): Int = newPredictionList.size

    override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
        return oldPredictionList[oldItemPosition].id == newPredictionList[newItemPosition].id
    }

    override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
        val oldPrediction = oldPredictionList[oldItemPosition]
        val newPrediction = newPredictionList[newItemPosition]
        return oldPrediction.id == newPrediction.id && oldPrediction.date == newPrediction.date
    }
}