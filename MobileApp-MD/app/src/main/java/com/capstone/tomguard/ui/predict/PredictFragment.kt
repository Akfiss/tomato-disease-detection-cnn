package com.capstone.tomguard.ui.predict

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.RequiresApi
import androidx.core.content.ContextCompat
import androidx.core.net.toUri
import com.capstone.tomguard.R
import com.capstone.tomguard.databinding.FragmentPredictBinding
import com.capstone.tomguard.ui.predict.CameraxActivity.Companion.CAMERAX_RESULT
import com.capstone.tomguard.ui.predict.utils.getImageUri
import com.capstone.tomguard.ui.result.ResultActivity

class PredictFragment : Fragment() {

    private lateinit var binding: FragmentPredictBinding

    private var currentImageUri: Uri? = null

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            showToast("Permission request granted")
        } else {
            showToast("Permission request denied")
        }
    }

    private fun allPermissionsGranted() = ContextCompat.checkSelfPermission(
        requireActivity(), REQUIRED_PERMISSION
    ) == PackageManager.PERMISSION_GRANTED

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        binding = FragmentPredictBinding.inflate(inflater, container, false)
        return binding.root
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        if (!allPermissionsGranted()) {
            requestPermissionLauncher.launch(REQUIRED_PERMISSION)
        }

        binding.layoutButton.galleryButton.setOnClickListener { startGallery() }
        binding.layoutButton.cameraButton.setOnClickListener { startCamera() }
        binding.layoutButton.cameraXButton.setOnClickListener { startCameraX() }
        binding.btnPredict.setOnClickListener {
            currentImageUri?.let {
                analyzeStaticImage(it)
            } ?: run {
                showToast(getString(R.string.empty_image_warning))
            }
        }
    }

    private fun startGallery() {
        launcherGallery.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
    }

    private val launcherGallery = registerForActivityResult(
        ActivityResultContracts.PickVisualMedia()
    ) { uri: Uri? ->
        if (uri != null) {
            currentImageUri = uri
            showImage()
        }
    }

    private fun startCamera() {
        currentImageUri = getImageUri(requireActivity())
        launcherIntentCamera.launch(currentImageUri)
    }


    private val launcherIntentCamera = registerForActivityResult(
        ActivityResultContracts.TakePicture()
    ) { isSuccess ->
        if (isSuccess) {
            showImage()
            Log.d("Debug", "currentImageUri $currentImageUri")
        }
    }

    private fun startCameraX() {
        val intent = Intent(requireActivity(), CameraxActivity::class.java)
        launcherIntentCameraX.launch(intent)
    }

    private val launcherIntentCameraX = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) {
        if (it.resultCode == CAMERAX_RESULT) {
            currentImageUri = it.data?.getStringExtra(CameraxActivity.EXTRA_CAMERAX_IMAGE)?.toUri()
            showImage()
        }
    }

    private fun showImage() {
        currentImageUri?.let {
            Log.d("Debug", "showImage: $it")
            binding.ivPreview.setImageURI(it)
        }
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    private fun analyzeStaticImage(uri: Uri) {
        val intent = Intent(requireActivity(), ResultActivity::class.java)
        intent.putExtra(ResultActivity.EXTRA_IMAGE_URI, uri.toString())
        startActivity(intent)
        //        val imageFile: File = uriToFile(uri, requireActivity())
        //        imageFile.reduceFileImage()
        //
        //        imageClassifierHelper = ImageClassifierHelper(
        //            context = requireActivity(),
        //            classifierListener = this
        //        )
        //        imageClassifierHelper.classifyStaticImage(uri)
    }

    //    override fun onError(error: String) {
    //        showToast(error)
    //    }

    //    override fun onResults(results: List<Classifications>?, inferenceTime: Long) {
    //        results?.let {
    //            showResults(it)
    //        } ?: run {
    //            showToast("No result found")
    //        }
    //    }

    //    private fun showResults(results: List<Classifications>) {
    //        val result = results[0]
    //        val title = result.categories[0].label
    //        val confidence = result.categories[0].score
    //        val prediction = "$title: ${(confidence * 100).toInt()}%"
    //
    //        binding.resultText.text = prediction
    //    }

    private fun showToast(message: String) {
        Toast.makeText(requireActivity(), message, Toast.LENGTH_SHORT).show()
    }

    companion object {
        private const val REQUIRED_PERMISSION = Manifest.permission.CAMERA
    }
}