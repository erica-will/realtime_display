import { NextRequest, NextResponse } from 'next/server';
import { pusher, PUSHER_CONFIG } from '@/lib/pusher';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!pusher) {
      return NextResponse.json(
        { error: 'Pusher 未配置' }, 
        { status: 500 }
      );
    }

    // 發送到我們的內容頻道
    await pusher.trigger(PUSHER_CONFIG.CHANNEL, PUSHER_CONFIG.EVENT, {
      type: 'test',
      message: body.message,
      timestamp: body.timestamp || new Date().toISOString()
    });

    // 同時發送到預設測試頻道
    await pusher.trigger('my-channel', 'my-event', {
      message: body.message,
      from: 'API test',
      timestamp: body.timestamp || new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: '測試訊息已發送'
    });
    
  } catch (error) {
    console.error('Pusher 測試 API 錯誤:', error);
    return NextResponse.json(
      { error: '發送失敗', details: error }, 
      { status: 500 }
    );
  }
}