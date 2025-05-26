'use client';
import React, { useEffect, useState } from 'react';
import TextEditor from '../textEditor';
import InputForm from '../inputForm';

export default function Hero() {

    const [adMessage, setAdMessage] = useState<any>(null);
    const [adImage, setAdImage] = useState<any>(null);

    return (
        <div className='flex flex-col items-center gap-4 justify-center h-fit lg:h-screen lg:py-4 max-w-[95%] lg:max-w-[75%] w-full'>
            <div className='w-full flex flex-col justify-end text-left h-[20vh] lg:h-[10%] px-3 lg-px-0'>
                <div className='flex gap-2 items-center justify-start mb-2'>
                    <div className='border-2 border-[#25d366] rounded-full p-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="size-3 stroke-[#25d366]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </div>
                    <p className='font-semibold text-[#25d366]'>Send Smarter, Reach Faster</p>
                </div>
                <p className='lg:text-4xl text-[#075e54] text-2xl lg:w-[70%] font-extrabold'>Broadcast WhatsApp Messages Instantly to Multiple Contacts with One Click</p>
            </div>
            <div className='w-full lg:h-[70%] flex flex-col-reverse lg:flex-row items-center justify-center shadow-background'>
                <div className='lg:w-[70%] w-full h-[70vh] pt-2 lg:p-2'>
                    <TextEditor adMessage={adMessage} setAdMessage={setAdMessage} adImage={adImage} setAdImage={setAdImage} />
                </div>
                <div className='lg:w-[30%] w-full lg:h-full h-fit py-2 lg:py-0 lg:pr-2'>
                    <InputForm adMessage={adMessage} setAdMessage={setAdMessage} adImage={adImage} />
                </div>
            </div>
        </div>
    )
}
