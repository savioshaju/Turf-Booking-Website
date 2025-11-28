import React from 'react'

const Error = () => {
    return (
        <div className='relative flex w-full h-screen justify-center items-center bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden'>

            <div className='relative z-10 text-center space-y-8 max-w-2xl mx-auto px-6'>

                <div className='flex justify-center'>
                    <div className='relative'>
                        <div className='w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg'>
                            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className='space-y-4'>
                    <h1 className='text-8xl font-black text-gray-800 tracking-tight'>
                        500
                    </h1>
                    <h2 className='text-4xl font-bold text-green-700 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent'>
                        Oops! Something went wrong
                    </h2>
                    <p className='text-xl text-gray-600 leading-relaxed max-w-md mx-auto'>
                        We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
                    </p>
                </div>


                <div className='pt-8'>
                    <p className='text-sm text-gray-500'>
                        Error Code: ERR_500_INTERNAL_SERVER_ERROR
                    </p>
                    <p className='text-sm text-gray-500 mt-2'>
                        If this problem persists, please contact our support team.
                    </p>-
                </div>
            </div>
            <div className='absolute top-8 right-8 transform rotate-12'>
                <div className='w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl opacity-20'></div>
            </div>

            <div className='absolute bottom-8 left-8  transform -rotate-12'>
                <div className='w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl opacity-20'></div>
            </div>

        </div>
    )
}

export default Error