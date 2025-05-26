"use client";
import { useState, useEffect } from 'react';
import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import * as XLSX from 'xlsx';
import { GoogleGenAI } from "@google/genai";
import Loader from './loader';

export default function InputForm({ adMessage, setAdMessage, adImage }: any) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [wabaid, setWabaId] = useState<string | null>(null);
    const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
    const [phoneNumberId, setPhoneNumberId] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [adPrompt, setAdPrompt] = useState('');
    const [loading, setLoading] = useState(false);

    const systemInstruction = "You are an expert WhatsApp ad copywriter. Based on the given product details, generate **one expressive, 3 paragraph, maximum 1024 characters, ready-to-send WhatsApp ad message**. The ad should:\
        - Be informal, persuasive, and creative.\
        - Use **emojis** naturally to enhance engagement.\
        - Be **long enough** to explain key benefits but still concise enough to hold attention.\
        - Feel like it was written to be sent as a **broadcast message** — no greetings or intros, and no extra commentary.\
        - **Only return the ad** message. Do not include multiple variations.\
    Focus on making the product appealing with engaging language, value-driven messaging, and emotional appeal. The output should be compelling, shareable, and usable with minimal modification.";

    const model = "gemini-2.0-flash";

    const ai = new GoogleGenAI({ apiKey: "AIzaSyApIlCnhN0Xl7YxN39Aauk9Djz4mA1oVpg" });

    async function handleGenerateAd() {

        setLoading(true);
        const response: any = await ai.models.generateContent({
            model: model,
            contents: adPrompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        if (response.error) {
            console.error('Error generating ad:', response.error);
            setStatus('Error generating ad');
            return;
        }
        setAdMessage(response.text);
        setLoading(false);
    }

    useEffect(() => {
        // Check for existing session or token to skip re-login if already authorized
        const token = localStorage.getItem('whatsapp_access_token');
        const phoneId = localStorage.getItem('phone_number_id');
        if (token && phoneId) {
            setAccessToken(token);
            setPhoneNumberId(phoneId);
            setIsLoggedIn(true);
            setStatus('Successfully logged in!');
        }
    }, []);

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/uploadImage', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (data.success) {
            // console.log('Uploaded Image URL:', data.imageUrl);
            return data.imageUrl
        } else {
            console.error('Upload failed:', data.message);
        }
    };

    const handleLogin = () => {
        const clientId = '975381434644661'; // Your Facebook App ID
        const redirectUri = 'https://localhost:3000/'; // Replace with your redirect URI
        const permissions = 'whatsapp_business_management,whatsapp_business_messaging'; // Required permissions
        const responseType = 'code';

        const loginUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${permissions}`;

        const popupWindow = window.open(loginUrl, '_blank', 'width=600,height=800');

        if (!popupWindow) {
            setStatus('Popup blocked. Please enable popups in your browser.');
            return;
        }

        const pollInterval = setInterval(() => {
            try {
                if (popupWindow?.location.href) {
                    const currentUrl = popupWindow.location.href;
                    if (currentUrl.includes('code=')) {
                        const urlParams = new URLSearchParams(new URL(currentUrl).search);
                        const code = urlParams.get('code');
                        if (code) {
                            clearInterval(pollInterval);
                            popupWindow.close(); // Close the popup after we get the code

                            // Send the code to the backend for token exchange
                            fetch('/api/', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'auth': code },
                                body: JSON.stringify({ code }),
                            })
                                .then((res) => res.json())
                                .then((data) => {
                                    console.log(data); // Log the response to inspect it

                                    if (data.accessToken) {
                                        // Successfully got access token, WABA ID, and phone number ID from backend
                                        setAccessToken(data.accessToken);
                                        setPhoneNumberId(data.phoneNumberId); // Set the phone number ID directly
                                        setWabaId(data.wabaId); // Store the WABA ID in the state
                                        setIsLoggedIn(true);
                                        localStorage.setItem('whatsapp_access_token', data.accessToken);
                                        localStorage.setItem('phone_number_id', data.phoneNumberId);
                                        localStorage.setItem('waba_id', data.wabaId); // Store the WABA ID in localStorage

                                        // Set the status message for successful login
                                        setStatus('Logged in successfully!');
                                    } else {
                                        setStatus('Error: Failed to exchange code for access token.');
                                    }
                                })
                                .catch((error) => {
                                    console.error('Error during token exchange:', error);
                                    setStatus('Error communicating with the server.');
                                });
                        }
                    }
                }
            } catch (error) {
                console.error('Error accessing popup URL:', error);
            }
        }, 1000); // Check every second if the authorization code is in the URL

        // Cleanup polling interval when the component unmounts
        return () => {
            clearInterval(pollInterval);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();

            reader.onload = () => {
                const binaryString = reader.result as string;
                const workbook = XLSX.read(binaryString, { type: 'binary' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                const extractedPhoneNumbers = sheetData.map((row: any) => row[0])
                    .filter((value: any) => typeof value === 'string' && value.startsWith('+'));

                console.log("Extracted :", extractedPhoneNumbers)

                setPhoneNumbers(extractedPhoneNumbers);
                setStatus('File uploaded and phone numbers extracted!');
            };

            reader.onerror = (error) => {
                setStatus('Error reading file');
                console.error(error);
            };

            reader.readAsArrayBuffer(selectedFile);
        }
    };

    const handleSendMessage = async () => {
        console.log('clicked')
        if (!adMessage) {
            setStatus('Please enter a message.');
            return;
        }

        if (phoneNumbers.length === 0) {
            setStatus('Please upload a file with phone numbers.');
            return;
        }

        if (!accessToken || !phoneNumberId) {
            setStatus('Please log in first.');
            return;
        }

        console.log("passed")

        setStatus('Sending messages...');

        try {

            const imageUrl = await handleUpload(adImage)
            console.log("Got image url : ", imageUrl)
            setLoading(true)

            // Send message to each phone number using the WhatsApp Business API
            const responses = await Promise.all(phoneNumbers.map(async (phoneNumber) => {
                console.log(phoneNumber)
                const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "messaging_product": 'whatsapp',
                        "recipient_type": "individual",
                        "to": phoneNumber,
                        "type": 'image',
                        "image": {
                            "link": imageUrl,
                            "caption": adMessage,
                        },
                    }),
                });

                const json = await response.json();
                console.log("response of", phoneNumber, ":", json);
                return json;
            }));

            setStatus('Messages sent successfully!');
            setLoading(false);
        } catch (error) {
            console.error('Error sending messages:', error);
            setStatus('Error sending messages');
        }
    };

    return (
        <div className='h-[100%]'>
            {loading && <div className='fixed top-0 left-0 w-screen h-screen z-50 flex justify-center items-center bg-gray-100 opacity-40'>
                <Loader />
            </div>}
            <Card className="w-full max-w-md pt-5 h-[100%]">
                <CardContent>
                    {!isLoggedIn ? (
                        <Button onClick={handleLogin} className="w-full h-[50px] bg-[#075e54] text-white">
                            <Upload className="mr-2 h-4 w-4" /> Login with WhatsApp
                        </Button>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label className="custum-file-upload" htmlFor="file">
                                    <div className="icon">
                                        {!file && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 stroke-[#128c7e]">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                        </svg>
                                        }
                                        {file && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                            className="stroke-[#128c7e] size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                                        </svg>

                                        }
                                    </div>
                                    <div className="!text-[#075e54]">
                                        {!file && <span>Click to upload excel file</span>}
                                        {file && <span>Contact information fetched !!!</span>}
                                    </div>
                                    <input type="file" id="file" onChange={handleFileChange} />
                                </label>

                            </div>
                            <div className="mb-4]">
                                <Label htmlFor="message" className="block text-sm font-medium text-[#128c7e]">
                                    Create Ad With AI Prompt
                                </Label>
                                <textarea
                                    id="message"
                                    value={adPrompt}
                                    rows={12}
                                    onChange={(e) => setAdPrompt(e.target.value)}
                                    placeholder="Generate a ad for customised lotus shaped scented candle which comes in different color and shape"
                                    className="mt-1 block placeholder:text-gray-500 w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-[#dcf8c6] mb-3"
                                />
                            </div>
                            <div className='flex justify-between gap-2'>
                            <button onClick={() => { handleGenerateAd() }} className="cursor-pointer transition-all w-1/2 bg-[#128c7e] text-white px-6 py-2 rounded-lg border-[#dcf8c6] border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">Generate Ad</button>
                            <button onClick={() => { handleSendMessage() }} className="cursor-pointer transition-all w-1/2 bg-[#25d366] text-white px-6 py-2 rounded-lg border-[#dcf8c6] border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">Send Ad</button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
