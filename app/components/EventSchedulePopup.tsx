"use client";

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, Chip, Box, Stack } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CloseIcon from '@mui/icons-material/Close';

interface ScheduleItem {
  time: string;
  title: string;
  speaker: string;
}

interface DaySchedule {
  day: string;
  title: string;
  schedule: ScheduleItem[];
}

const scheduleData: DaySchedule[] = [
  {
    day: "22 Kasım",
    title: "Yeni Teknolojiler ve Web Trendleri",
    schedule: [
      { time: "09:30", title: "Açılış ve Tanıtım", speaker: "Organizasyon Ekibi" },
      { time: "10:00", title: "2025'in Web Trendleri", speaker: "Ayşe Yıldız (Google)" },
      { time: "11:30", title: "Next.js 14 ile Uygulama Geliştirme", speaker: "Mehmet Güler (Freelancer)" },
      { time: "13:00", title: "Öğle Arası", speaker: "" },
      { time: "14:00", title: "Edge Computing ve Serverless Mimariler", speaker: "Emre Korkmaz (Vercel)" },
      { time: "15:30", title: "React Native ile Çapraz Platform Deneyimi", speaker: "Zeynep Acar (Trendyol)" },
      { time: "17:00", title: "Kapanış & Soru-Cevap", speaker: "Tüm Katılımcılar" }
    ]
  },
  {
    day: "23 Kasım",
    title: "Backend, API'ler ve Veritabanı Teknolojileri",
    schedule: [
      { time: "10:00", title: "Modern API Tasarımı: REST vs GraphQL", speaker: "Engin Arda (GitHub)" },
      { time: "11:30", title: "Node.js ile Performanslı Backend Mimarileri", speaker: "Hatice Doğan (Hepsiburada)" },
      { time: "13:00", title: "Öğle Arası", speaker: "" },
      { time: "14:00", title: "PostgreSQL ve MongoDB Kıyaslaması", speaker: "Murat Keskin (Datarush)" },
      { time: "15:30", title: "Mikroservisler ve Kubernetes'e Giriş", speaker: "Elif Demir (Microsoft)" },
      { time: "17:00", title: "Panel: Yazılımda Takım Kültürü ve DevOps", speaker: "Konuklar" }
    ]
  },
  {
    day: "24 Kasım",
    title: "Kariyer, Erişilebilirlik ve Uygulamalı Atölyeler",
    schedule: [
      { time: "10:00", title: "Junior'dan Senior'a: Kariyer Yolculukları", speaker: "Can Yalçın (Yazılım Eğitmeni)" },
      { time: "11:30", title: "Web'de Erişilebilirlik (A11y)", speaker: "Fatma Çetin (a11y.dev)" },
      { time: "13:00", title: "Öğle Arası", speaker: "" },
      { time: "14:00", title: "Canlı Kodlama: Blog Uygulaması Kurulumu", speaker: "Atölye / Mentor Eşliğinde" },
      { time: "15:30", title: "CV Hazırlama ve LinkedIn Tüyoları", speaker: "İnsan Kaynakları Paneli" },
      { time: "17:00", title: "Sertifika Dağıtımı & Kapanış", speaker: "Organizasyon Ekibi" }
    ]
  }
];

interface EventDayCardProps {
  day: string;
  title: string;
  description: string;
  daySchedule: DaySchedule;
  onClick: () => void;
}

const EventDayCard: React.FC<EventDayCardProps> = ({ day, title, description, onClick }) => {
  return (
    <Paper 
      elevation={0}
      onClick={onClick}
      sx={{
        p: 2,
        bgcolor: 'rgba(31, 41, 55, 0.8)',
        border: '1px solid rgba(75, 85, 99, 0.5)',
        borderRadius: 2,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          bgcolor: 'rgba(31, 41, 55, 0.9)',
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
          borderColor: 'rgba(139, 92, 246, 0.5)'
        }
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
        <CalendarTodayIcon sx={{ color: '#8B5CF6', fontSize: 18 }} />
        <Typography 
          variant="subtitle1"
          sx={{ 
            color: '#8B5CF6',
            fontWeight: 500
          }}
        >
          {day}: {title}
        </Typography>
      </Stack>
      <Typography 
        variant="body2"
        sx={{ 
          color: 'rgba(243, 244, 246, 0.8)',
          ml: 3.5
        }}
      >
        {description}
      </Typography>
    </Paper>
  );
};

const ScheduleDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  daySchedule: DaySchedule | null;
}> = ({ open, onClose, daySchedule }) => {
  if (!daySchedule) return null;
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        sx: {
          bgcolor: '#1F2937',
          backgroundImage: 'linear-gradient(rgba(30, 41, 59, 0.9), rgba(17, 24, 39, 0.95))',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(75, 85, 99, 0.5)',
          color: 'white'
        }
      }}
    >
      <Box sx={{ 
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <DialogTitle sx={{ p: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventNoteIcon sx={{ color: '#8B5CF6' }} />
          <Typography variant="h6" component="div" sx={{ color: '#8B5CF6' }}>
            {daySchedule.day}: {daySchedule.title}
          </Typography>
        </DialogTitle>
        <Button 
          onClick={onClose}
          sx={{ minWidth: 'auto', p: 1, color: 'rgba(255, 255, 255, 0.7)' }}
        >
          <CloseIcon />
        </Button>
      </Box>
      <DialogContent dividers sx={{ bgcolor: 'transparent', borderColor: 'rgba(75, 85, 99, 0.5)' }}>
        <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    color: '#8B5CF6', 
                    borderBottom: '1px solid rgba(75, 85, 99, 0.5)',
                    width: '100px' 
                  }}
                >
                  Saat
                </TableCell>
                <TableCell 
                  sx={{ 
                    color: '#8B5CF6', 
                    borderBottom: '1px solid rgba(75, 85, 99, 0.5)'
                  }}
                >
                  Oturum
                </TableCell>
                <TableCell 
                  sx={{ 
                    color: '#8B5CF6', 
                    borderBottom: '1px solid rgba(75, 85, 99, 0.5)'
                  }}
                >
                  Konuşmacı
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {daySchedule.schedule.map((item, idx) => (
                <TableRow 
                  key={idx} 
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    bgcolor: item.title === "Öğle Arası" ? 'rgba(0, 0, 0, 0.15)' : 'transparent'
                  }}
                >
                  <TableCell 
                    sx={{ 
                      color: item.title === "Öğle Arası" ? 'rgba(255, 255, 255, 0.5)' : 'white',
                      borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
                    }}
                  >
                    {item.time}
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      color: item.title === "Öğle Arası" ? 'rgba(255, 255, 255, 0.5)' : 'white',
                      borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
                      fontWeight: item.title === "Öğle Arası" ? 'normal' : 'medium'
                    }}
                  >
                    {item.title}
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
                      fontSize: '0.8rem'
                    }}
                  >
                    {item.speaker ? (
                      <Chip 
                        label={item.speaker} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(139, 92, 246, 0.2)',
                          color: '#C4B5FD',
                          fontSize: '0.75rem'
                        }} 
                      />
                    ) : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default function EventSchedulePopup() {
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(null);
  const [open, setOpen] = useState(false);

  const handleDayClick = (day: DaySchedule) => {
    setSelectedDay(day);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 mb-6 shadow-lg border border-gray-700">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <EventNoteIcon sx={{ color: 'white', mr: 1 }} />
        <Typography variant="h6" component="h3" sx={{ color: 'white', fontWeight: 500 }}>
          Program
        </Typography>
      </Box>
      <Stack spacing={2}>
        {scheduleData.map((data, index) => (
          <EventDayCard
            key={index}
            day={data.day}
            title={data.title}
            description={index === 0 ? "Yeni teknolojiler ve güncel web trendleri" : 
                        index === 1 ? "Backend ve veri yönetimi" : 
                        "Kariyer ve pratik uygulamalar"}
            daySchedule={data}
            onClick={() => handleDayClick(data)}
          />
        ))}
      </Stack>
      <ScheduleDialog 
        open={open} 
        onClose={handleClose} 
        daySchedule={selectedDay} 
      />
    </div>
  );
} 