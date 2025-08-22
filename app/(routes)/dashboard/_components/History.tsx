'use client' //as react hooks cannot work on server side we have to render this on client side 
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react';

function History() {
  const [userHistory, setUserHistory] = useState([]);

  return (
    <div className='mt-5 p-5 border rounded-xl'>
      <h2 className="font-bold text-lg ">Previous History</h2>
      <p>What you previously worked on, you can find here</p>

      {userHistory?.length === 0 && (
        <div className='flex items-center justify-center mt-5 flex-col mt-6' >
          <Image
            src="/idea.png"
            alt="bulb"
            width={50}
            height={50}
          />
          <h2>You do Not Have any history</h2>
          <Button className='mt-5'>Explore AI Tools</Button>
        </div>
      )}
    </div>
  );
}

export default History;

