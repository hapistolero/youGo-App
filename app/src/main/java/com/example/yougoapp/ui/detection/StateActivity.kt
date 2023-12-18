package com.example.yougoapp.ui.detection

import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.viewModels
import com.example.yougoapp.R
import com.example.yougoapp.data.State
import com.example.yougoapp.databinding.ActivityStateBinding
import com.example.yougoapp.factory.ViewModelFactory
import com.example.yougoapp.ui.pose.DetailPoseActivity
import com.example.yougoapp.ui.reduceFileImage
import com.example.yougoapp.ui.uriToFile

class StateActivity : AppCompatActivity() {
    private  val viewModel by viewModels<DetectionViewModel> {
        ViewModelFactory.getInstance(this)
    }
    private  lateinit var binding: ActivityStateBinding
    private var imageUri: Uri? = null

    companion object{
        const val EXTRA_IMAGE = "image"
        const val ID_EXTRA = "id"
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityStateBinding.inflate(layoutInflater)
        setContentView(binding.root)
        val id= intent.getStringExtra(ID_EXTRA)
        Log.d("cek state",id?:"")
        imageUri = intent?.getStringExtra(EXTRA_IMAGE)?.let { Uri.parse(it) }
        Log.d("image",imageUri.toString())
        showImage()
        binding.btnSend.setOnClickListener {
            imageUri?.let { uri ->
                val imageFile = uriToFile(uri,this).reduceFileImage()

                viewModel.checkMyDetection(id?:"",imageFile).observe(this){data->
                    if (data !=null){
                        when(data){
                            is State.Loading ->{

                            }
                            is State.Success ->{
                                val poseName  = data.data.pose.yogaPose
                                val akurasi = data.data.pose.confidence
                                val  iscorrect = data.data.pose.isCorrectPose

                                val intent= Intent(this, ResultActivity::class.java)
                                intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK
                                intent.putExtra(ResultActivity.EXTRA_NAME,poseName)
                                intent.putExtra(ResultActivity.EXTRA_AKURASI,akurasi)
                                intent.putExtra(ResultActivity.EXTRA_ISCORRECT,iscorrect)
                                intent.putExtra(ResultActivity.EXTRA_IMAGE, imageFile.toString())
                                startActivity(intent)
                                finish()
                            }
                            is State.Error ->{
                                Toast.makeText(this,"ERROR", Toast.LENGTH_LONG).show()
                            }
                            else -> false
                        }
                    }
                }
            }
        }
    }
    private  fun showImage(){
        imageUri?.let {
            Log.d("Image URL", "ShowImage: $it")
            binding.imageView.setImageURI(it)
        }
    }
}