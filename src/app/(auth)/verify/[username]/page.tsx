'use client'
import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { FormProvider, useForm } from 'react-hook-form'
import { signUpSchema } from '@/schemas/signUpSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { verifyCode } from '@/schemas/verifySchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const VerifyAccount = () => {

    const router = useRouter()
    const params = useParams<{username: string}>()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof verifyCode>>({
        resolver : zodResolver(verifyCode),
    })

    const onSubmit = async (data : z.infer<typeof verifyCode>) => {
        try{
            const response = await axios.post('/api/verify-code',{
                username : params.username,
                code : data.code
            })

            toast({
                title : "success",
                description : response.data.message,
            })

            router.replace('/sign-in')
        }catch(error){
            console.error("Error in signup of user",error)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message || 'An error occurred'
            toast({
                title : "Signup failed",
                description : errorMessage,
                variant : 'destructive'
            })  
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        Verify Your Account
                    </h1>
                    <p className='mb-4'>Enter the verification code sent to your email</p>
                </div>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField 
                            name="code"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full'>
                            Verify Account
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </div>
    )
}

export default VerifyAccount