package com.capstone.tomguard.ui.profile

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.viewModels
import com.bumptech.glide.Glide
import com.capstone.tomguard.R
import com.capstone.tomguard.databinding.FragmentProfileBinding
import com.capstone.tomguard.ui.MainViewModelFactory
import com.capstone.tomguard.ui.login.LoginActivity
import com.capstone.tomguard.data.Result
import com.capstone.tomguard.data.model.ProfileResponse
import com.capstone.tomguard.data.model.User

class ProfileFragment : Fragment() {

    private lateinit var binding: FragmentProfileBinding

    private val viewModel by viewModels<ProfileViewModel> {
        MainViewModelFactory.getInstance(requireContext())
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View? {
        binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel.getSession().observe(viewLifecycleOwner) { user ->
            if (!user.isLogin) {
                startActivity(Intent(requireContext(), LoginActivity::class.java))
            } else {
                getProfile(user.token)
            }
        }

        binding.tvLogout.setOnClickListener { logout() }
    }

    private fun getProfile(token: String) {
        viewModel.getProfile(token).observe(viewLifecycleOwner) {
            when (it) {
                is Result.Loading -> showLoading(true)
                is Result.Success -> {
                    val profile = it.data
                    setProfileData(profile)
                    showLoading(false)
                }
                is Result.Error -> {
                    showLoading(false)
                    binding.ivProfile.setImageResource(R.drawable.ic_account_circle_grey_128)
                }
                null -> showLoading(false)
            }
        }
    }

    private fun setProfileData(profile: ProfileResponse) {
        Log.d("Debug", "setProfileData: ProfileFragment: profilePictureUrl: ${profile.profilePictureUrl}")
        binding.apply {
            Glide
                .with(this@ProfileFragment)
                .load(profile.profilePictureUrl)
                .fitCenter()
                .into(ivProfile)
            tvUsername.text = profile.name
            tvEmail.text = profile.email
        }
    }

    private fun logout() {
        AlertDialog.Builder(requireContext()).apply {
            setTitle(getString(R.string.logout))
            setMessage(getString(R.string.logout_message))
            setPositiveButton(R.string.yes) { _, _ ->
                viewModel.logout()
            }
            setNegativeButton(R.string.no) { _, _ ->

            }
            create()
            show()
        }
    }

    private fun showLoading(isLoading: Boolean) {
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
    }
}