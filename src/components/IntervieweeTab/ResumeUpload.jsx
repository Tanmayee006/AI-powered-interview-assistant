import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { parseResume, getMissingFields } from '../../services/resumeParser';
import { setCurrentCandidate, setMissingFields, setCollectingField, addMessage, setInterviewState } from '../../redux/slices/interviewSlice';
import { setNotification } from '../../redux/slices/uiSlice';
import { validateFile } from '../../utils/validators';
import { INTERVIEW_STATES, MESSAGE_TYPES } from '../../utils/constants';

const ResumeUpload = () => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (file) => {
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      dispatch(setNotification({
        type: 'error',
        message: validation.error
      }));
      return;
    }

    setIsProcessing(true);
    dispatch(addMessage({
      type: MESSAGE_TYPES.SYSTEM,
      content: 'Processing your resume... Please wait.',
      timestamp: Date.now()
    }));

    try {
      const result = await parseResume(file);

      if (!result.success) {
        throw new Error(result.error || 'Failed to parse resume');
      }

      const candidate = {
        id: Date.now(),
        name: result.name,
        email: result.email,
        phone: result.phone,
        resumeFile: file.name,
        answers: [],
        messages: [],
        status: 'IN_PROGRESS',
        createdAt: new Date().toISOString()
      };

      dispatch(setCurrentCandidate(candidate));

      const missing = getMissingFields(result);

      if (missing.length > 0) {
        dispatch(setMissingFields(missing));
        dispatch(setCollectingField(missing[0]));
        dispatch(setInterviewState(INTERVIEW_STATES.COLLECTING_INFO));
        dispatch(addMessage({
          type: MESSAGE_TYPES.SYSTEM,
          content: '✅ Resume uploaded successfully!',
          timestamp: Date.now()
        }));
        dispatch(addMessage({
          type: MESSAGE_TYPES.BOT,
          content: `Thanks for uploading your resume! I need a few more details before we start.\n\nWhat is your ${missing[0]}?`,
          timestamp: Date.now()
        }));
      } else {
        dispatch(setInterviewState(INTERVIEW_STATES.NOT_STARTED));
        dispatch(addMessage({
          type: MESSAGE_TYPES.SYSTEM,
          content: '✅ Resume uploaded successfully!',
          timestamp: Date.now()
        }));
        dispatch(addMessage({
          type: MESSAGE_TYPES.BOT,
          content: `Great! I found your details:\n\n📝 Name: ${result.name}\n📧 Email: ${result.email}\n📞 Phone: ${result.phone}\n\nReady to start your Full Stack Developer interview?`,
          timestamp: Date.now()
        }));
        dispatch(addMessage({
          type: MESSAGE_TYPES.SYSTEM,
          content: '💡 Type "start" to begin the interview.',
          timestamp: Date.now()
        }));
      }

      dispatch(setNotification({
        type: 'success',
        message: 'Resume processed successfully!'
      }));
    } catch (error) {
      console.error('Resume upload error:', error);
      dispatch(addMessage({
        type: MESSAGE_TYPES.SYSTEM,
        content: `❌ Error processing resume: ${error.message}. Please try again.`,
        timestamp: Date.now()
      }));
      dispatch(setNotification({
        type: 'error',
        message: 'Failed to process resume. Please try again.'
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <FileText className="text-blue-600" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Upload Your Resume
          </h2>
          <p className="text-gray-600 text-lg">
            Start your AI-powered interview by uploading your resume
          </p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-3 border-dashed rounded-xl p-12 transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
          } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="text-center">
            <Upload className="mx-auto mb-4 text-gray-400" size={64} />
            
            {isProcessing ? (
              <div className="space-y-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                <p className="text-lg font-medium text-gray-700">
                  Processing your resume...
                </p>
                <p className="text-sm text-gray-500">
                  This may take a few seconds
                </p>
              </div>
            ) : (
              <>
                <p className="text-xl font-medium text-gray-700 mb-2">
                  Drag & Drop your resume here
                </p>
                <p className="text-gray-500 mb-6">or</p>
                
                <label className="inline-block">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={isProcessing}
                  />
                  <span className="bg-blue-600 text-white px-8 py-3 rounded-lg cursor-pointer hover:bg-blue-700 inline-block font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                    Choose File
                  </span>
                </label>

                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>PDF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>DOCX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-gray-400" />
                    <span>Max 10MB</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle size={18} />
            What we'll extract:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 ml-6">
            <li>• Your full name</li>
            <li>• Email address</li>
            <li>• Phone number</li>
          </ul>
          <p className="text-xs text-blue-700 mt-3">
            If any information is missing, our chatbot will ask you for it before starting the interview.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;