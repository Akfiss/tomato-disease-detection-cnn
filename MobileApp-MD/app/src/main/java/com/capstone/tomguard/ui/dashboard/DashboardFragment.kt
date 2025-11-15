package com.capstone.tomguard.ui.dashboard

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.capstone.tomguard.databinding.FragmentDashboardBinding
import com.capstone.tomguard.ui.PredictionViewModelFactory

class DashboardFragment : Fragment() {

    private lateinit var binding: FragmentDashboardBinding

    private val viewModel by viewModels<DashboardViewModel> {
        PredictionViewModelFactory.getInstance(requireActivity().application)
    }

    private lateinit var adapter: PredictionAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        binding = FragmentDashboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        adapter = PredictionAdapter()
        binding.rvPredictions.layoutManager = LinearLayoutManager(context)
        binding.rvPredictions.adapter = adapter

        viewModel.getAllPredictions().observe(viewLifecycleOwner) { predictionList ->
            if (predictionList != null) {
                adapter.setListPredictions(predictionList)

            }
        }
    }
}