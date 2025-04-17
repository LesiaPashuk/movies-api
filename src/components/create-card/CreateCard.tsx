import React, { useCallback, useEffect, useState } from "react";
import '../create-card/createCard.css';
import { z } from "zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { PropsType } from "../card/Card";
import { zodResolver } from '@hookform/resolvers/zod';
import { RootStateType } from "@/store/store";
import { createSelector, original } from "@reduxjs/toolkit";
import { addCardAC } from "/фронт/alfaTest/src/state/reducer-for-card";
import { Link } from "react-router-dom";
const formSchema=z
.object({
    productName:z
    .string()
    .min(2, {message:"Название слишком короткое"})
    .max(30, "Имя слишкои длинное"),
    content:z
    .string()
    .min(2, {message:"Описание слишком короткое"})
    .max(500, {message:"Описание слишком длинное"}),
    photo:z
    .custom<FileList>()
    .refine((files)=>files?.length>0,{message:"Изображение обязательно"})
    .refine((files)=>files?.[0].size<=5_000_000, {message:"Размер файла должен быть не более 5MB"})
    .refine((files)=>{
        return ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type)
    }, {message:"Поддерживаются только .jpg, .png и .webp форматы"}), 
    release_date:z
    .string()
    .refine((date)=>date?.length>0, {message:"Дата релиза обязательна"}), 
    vote_average:z
    .number()
    .refine((date)=>date<10&&date>0, {message:"Оценка обязательна"}),
    original_language:z
    .string()
    .refine(date=>date?.length>0, {message:"Заполните поле"}),
    original_title:z
    .string()
    .refine(date=>date?.length>0, {message:"Заполните поле"})


});
type formSchema=z.infer<typeof formSchema>

export const CreateCard=React.memo(function(props:PropsType){

    const dispatchCard =useDispatch();
   const [preview, setPreview]=useState<string>("")
    const {
        handleSubmit, 
        reset, 
        setFocus, 
        register, 
        control,
        formState:{ isDirty, isSubmitting, errors}, 
    }=useForm<formSchema>({resolver:zodResolver(formSchema)})
    const onSubmit :SubmitHandler<formSchema>=(data)=>{
        addCard(data.productName, data.content, preview, data.release_date, data.vote_average, data.original_language, data.original_title, false)
        reset()
    } 
    const addCard=useCallback((title:string, content:string, imgPath:string,release_date:string,vote_average:number,original_language:string,original_title:string,favoriteStatus:boolean)=>{
              const action = addCardAC(title, content, imgPath, release_date, vote_average, original_language, original_title, favoriteStatus)
              dispatchCard(action)
        },[dispatchCard])
      
    const photo = useWatch({
        control, 
        name:'photo'
    });
    useEffect(()=>{
        setFocus("productName")
    },[setFocus])
    useEffect(()=>{
        if(photo?.[0]){
            const reader= new FileReader();
            reader.onload=()=>{
                setPreview(reader.result as string);
            }
            reader.readAsDataURL(photo[0])
        }
        else{
            setPreview("")
        }
    }, [photo])
    return <section className="bg-gray-1000">
        <Link to='/product'>
   <button type="button"  className="
    absolute top-5 right-5
    w-[170px] h-11
    bg-[#a50606] hover:bg-white  
    text-white hover:text-[#a50606]
    rounded-full
    flex items-center justify-center
    transition-colors
  ">Вернуться назад</button></Link>
        <div className='flex flex-col items-center justify-center px-10 py-8 mx-auto md:min-h-screen lg:py-8'>
            <div className='w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-2xl xl:p-6'>
                <div className='p-6 space-y-4 md:space-y-5 sm:p-8'>
                    <h1 className="title">Создать карточку</h1>
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-6">
                        <label htmlFor="productName" className="label">
                            Название товара
                        </label>
                        <input type="text" 
                        {...register('productName')}
                        id="productName"
                        className="input"
                        placeholder="Введите название"
                        aria-invalid={errors.productName?'true':'false'}
                        />
                        {errors.productName &&(
                            <span role="alert" className="error">
                                {errors.productName?.message}
                            </span>
                        )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="content" className="label">Описание</label>
                            <input type="text"
                            {...register('content')}
                            id="content"
                            className="input"
                            placeholder="Опишите товар" 
                            aria-invalid={errors.content?'true':'false'} />
                            {errors.content && (
                                <span role="alert" className="error">
                                    {errors.content?.message}
                                </span>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="release_date" className="label">Дата релиза</label>
                            <input type="date"
                            {...register('release_date')} 
                            id='release_date'
                            className="input"
                            placeholder="Введите дату"
                            aria-invalid={errors.release_date?'true':'false'}/>
                            {errors.release_date&&(
                                <span role="alert" className="error">
                                    {errors.release_date?.message}
                                </span>
                            )}
                        </div>
                        <div className="mb-4">
                                <label htmlFor="vote_average" className="label">Оценка</label>
                                <input type="number" min={0} max={10}
                                id="vote_average"
                                {...register("vote_average",{ 
                                    valueAsNumber: true 
                                  })}
                                className="input" 
                                placeholder="Оцените фильм"
                                aria-invalid={errors.vote_average?"true":"false"}/>
                                {errors.vote_average&&(
                                    <span role="alert" className="error">
                                        {errors.vote_average?.message}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                            <label htmlFor="original_language" className="label">Оригинальный язык</label>
                            <input type="text"
                            {...register('original_language')} 
                            id='original_language'
                            className="input"
                            placeholder="Написать"
                            aria-invalid={errors.original_language?'true':'false'}/>
                            {errors.original_language&&(
                                <span role="alert" className="error">
                                    {errors.original_language?.message}
                                </span>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="original_title"className="label" >Оригинальное название фильмы</label>
                            <input type="text"
                            {...register('original_title')} 
                            id='original_title'
                            className="input"
                            placeholder="Написать"
                            aria-invalid={errors.original_title?'true':'false'}/>
                            {errors.original_title&&(
                                <span role="alert" className="error">
                                    {errors.original_title?.message}
                                </span>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="photo" className="label">Прикрепите фотографию</label>
                            <div className="flex items-center gap-3">
                                <label htmlFor="photo"
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                                >Выбрать файл</label>
                                <span className="text-sm text-gray-500">{photo?.[0].name||"Файл не выбран"}</span>
                            </div>
                            <input type="file"
                            {...register('photo')}
                            id="photo"
                            accept="image/jpeg, image/png, image/webp"
                            className="sr-only"
                            aria-invalid={errors.content?'true':'false'}
                            />
                            {errors.photo&&(
                                <span role="alert" className="error">
                                    {errors.photo?.message}
                                </span>
                            )}
                            <div className="photoItem  mt-3 w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                                {preview?(<img
                                src={preview}
                                alt="Превью"
                                className="w-full h-full object-cover"
                                ></img>): <span className="text-gray-500 text-sm">Превью изображения</span>
                                }
                            </div>
                            
                        </div>
                        <div className="flex gap-5 justify-center pt-2">
                            <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!isDirty||isSubmitting}
                            >Создать карточку</button>
                            <button
                            type="button"
                            className="btn btn-error"
                            disabled={!isDirty||isSubmitting}
                            onClick={()=>reset()}
                            >Очистить поля</button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
        
    </section>
})