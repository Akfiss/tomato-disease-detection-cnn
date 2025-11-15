package com.capstone.tomguard.ui.dashboard

import android.net.Uri
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.capstone.tomguard.R
import com.capstone.tomguard.data.local.database.Prediction
import com.capstone.tomguard.databinding.LayoutItemPredictionBinding

class PredictionAdapter : RecyclerView.Adapter<PredictionAdapter.PredictionViewHolder>() {

    private val listPrediction = ArrayList<Prediction>()

    fun setListPredictions(listPrediction: List<Prediction>) {
        val diffCallback = PredictionDiffCallback(this.listPrediction, listPrediction)
        val diffResult = DiffUtil.calculateDiff(diffCallback)
        this.listPrediction.clear()
        this.listPrediction.addAll(listPrediction)
        diffResult.dispatchUpdatesTo(this)
    }


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PredictionViewHolder {
        val binding =
            LayoutItemPredictionBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return PredictionViewHolder(binding)
    }

    override fun onBindViewHolder(holder: PredictionAdapter.PredictionViewHolder, position: Int) {
        holder.bind(listPrediction[position])
    }

    override fun getItemCount(): Int {
        return listPrediction.size
    }

    inner class PredictionViewHolder(private val binding: LayoutItemPredictionBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(prediction: Prediction) {
            with(binding) {
                Glide.with(ivItemPhoto.context)
                    .load(prediction.imageUri)
                    .placeholder(R.drawable.ic_place_holder)
                    .into(ivItemPhoto)
                ivItemPhoto.setImageURI(Uri.parse(prediction.imageUri))
                tvItemResult.text = prediction.result
                tvItemInferenceTime.text = "${prediction.inferenceTime} ms"
                tvItemDate.text = prediction.date
            }
        }
    }
}