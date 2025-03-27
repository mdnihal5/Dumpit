import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

// Use these typed hooks throughout the app instead of plain useDispatch and useSelector
export const useAppDispatch = () => useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 