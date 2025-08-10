import { format } from 'date-fns';
import { Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { Message } from '@/features/chats/types/Message.type';
import MessageAttachments from './message-attachments';

interface MessageProps {
  message: Message;
  hideAttachments?: boolean;
}

const MessageBox = ({ message: msg, hideAttachments = false }: MessageProps) => {
  const convertToLocalTime = (backendTimestamp: string | Date) => {
    // Si la fecha del backend ya incluye información de zona horaria, JavaScript
    // automáticamente la convertirá a la zona horaria local
    return new Date(backendTimestamp);
  };

  const localDate = convertToLocalTime(msg.timestamp);
  const hasAttachments = msg.attachments && msg.attachments.length > 0;

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          'chat-box max-w-72 border-2 px-3 py-2 break-words shadow-sm',
          msg.direction === 'OUTBOUND'
            ? 'bg-primary/85 text-primary-foreground/75 border-primary-foreground self-end rounded-[16px_16px_0_16px]'
            : 'bg-secondary border-secondary self-start rounded-[16px_16px_16px_0]'
        )}
      >
        {msg.body}
        {hasAttachments && !hideAttachments && (
          <div className={cn(
            'flex items-center gap-1 mt-1',
            msg.direction === 'OUTBOUND' ? 'justify-end' : 'justify-start',
            'border-t pt-1 border-opacity-20',
            msg.direction === 'OUTBOUND' ? 'border-primary-foreground/20' : 'border-secondary-foreground/20'
          )}>
            <Paperclip className="h-3 w-3 opacity-70" />
            <span className="text-xs opacity-70">
              {msg.attachments.length === 1 
                ? '1 archivo adjunto' 
                : `${msg.attachments.length} archivos adjuntos`}
            </span>
          </div>
        )}
        <span
          className={cn(
            'text-muted-foreground mt-1 block text-xs font-light italic',
            msg.direction === 'OUTBOUND' && 'text-right'
          )}
        >
          {format(localDate, 'h:mm a')}
        </span>
      </div>

      {/* Mostrar los attachments debajo del mensaje */}
      {hasAttachments && !hideAttachments && (
        <MessageAttachments 
          attachments={msg.attachments} 
          direction={msg.direction}
          className={cn(
            msg.direction === 'OUTBOUND' ? 'self-end' : 'self-start'
          )}
        />
      )}
    </div>
  );
};


export default MessageBox
