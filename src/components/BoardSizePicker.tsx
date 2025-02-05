"use client";
import React from 'react';
import { useDispatch } from 'react-redux';

import { supportedBoardSizes } from '@/configs/config';
import { reset } from '@/store/slices/applicationSlice';
import Button from './Button';

const BoardSizePicker: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <h2 className="text-lg pt-4 pb-2 font-semibold">Board size</h2>
      <div className="size-picker">
        {supportedBoardSizes.map(size => (
          <Button key={size} onClick={() => dispatch(reset(size))}>{size}x{size}</Button>
        ))}
      </div>
    </div>
  );
};

export default BoardSizePicker;
