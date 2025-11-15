package com.capstone.tomguard.register

import android.graphics.Color
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.capstone.tomguard.R
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout

class RegisterActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_register)

        setupTextInputFocusChangeListener(R.id.nameEditText, R.id.nameEditTextLayout)
        setupTextInputFocusChangeListener(R.id.emailEditText, R.id.emailEditTextLayout)
        setupTextInputFocusChangeListener(R.id.passwordEditText, R.id.passwordEditTextLayout)
        setupTextInputFocusChangeListener(
            R.id.confirmPasswordEditText,
            R.id.confirmPasswordEditTextLayout
        )
    }

    private fun setupTextInputFocusChangeListener(editTextId: Int, textInputLayoutId: Int) {
        val editText = findViewById<TextInputEditText>(editTextId)
        val textInputLayout = findViewById<TextInputLayout>(textInputLayoutId)

        editText.setOnFocusChangeListener { _, hasFocus ->
            if (hasFocus) {
                textInputLayout.boxStrokeColor = Color.parseColor("#FFA500") // Orange color
            } else {
                textInputLayout.boxStrokeColor = Color.WHITE
            }
        }
    }
}
