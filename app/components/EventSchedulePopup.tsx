"use client";

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Chip, Box, IconButton, Tabs, Tab, Paper, Stack } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CloseIcon from '@mui/icons-material/Close';

interface ScheduleItem {
  time: string;
  title: string;
  speaker?: string;
  description?: string;
}

interface DaySchedule {
  title: string;
  days: string[];
  schedule: ScheduleItem[];
}

const scheduleData: DaySchedule[] = [
  {
    title: "Yeni Teknolojiler ve Web Trendleri",
    days: ["22 Kasım"],
    schedule: [
      { time: "09:30", title: "Açılış ve Tanıtım", speaker: "Organizasyon Ekibi" },
      { time: "10:00", title: "2025'in Web Trendleri", speaker: "Ayşe Yıldız (Google)" },
      { time: "11:30", title: "Next.js 14 ile Uygulama Geliştirme", speaker: "Mehmet Güler (Freelancer)" },
      { time: "13:00", title: "Öğle Arası" },
      { time: "14:00", title: "Edge Computing ve Serverless Mimariler", speaker: "Emre Korkmaz (Vercel)" },
      { time: "15:30", title: "React Native ile Çapraz Platform Deneyimi", speaker: "Zeynep Acar (Trendyol)" },
      { time: "17:00", title: "Kapanış & Soru-Cevap", speaker: "Tüm Katılımcılar" }
    ]
  },
  {
    title: "Backend, API'ler ve Veritabanı Teknolojileri",
    days: ["23 Kasım"],
    schedule: [
      { time: "10:00", title: "Modern API Tasarımı: REST vs GraphQL", speaker: "Engin Arda (GitHub)" },
      { time: "11:30", title: "Node.js ile Performanslı Backend Mimarileri", speaker: "Hatice Doğan (Hepsiburada)" },
      { time: "13:00", title: "Öğle Arası" },
      { time: "14:00", title: "PostgreSQL ve MongoDB Kıyaslaması", speaker: "Murat Keskin (Datarush)" },
      { time: "15:30", title: "Mikroservisler ve Kubernetes'e Giriş", speaker: "Elif Demir (Microsoft)" },
      { time: "17:00", title: "Panel: Yazılımda Takım Kültürü ve DevOps", speaker: "Konuklar" }
    ]
  },
  {
    title: "Kariyer, Erişilebilirlik ve Uygulamalı Atölyeler",
    days: ["24 Kasım"],
    schedule: [
      { time: "10:00", title: "Junior'dan Senior'a: Kariyer Yolculukları", speaker: "Can Yalçın (Yazılım Eğitmeni)" },
      { time: "11:30", title: "Web'de Erişilebilirlik (A11y)", speaker: "Fatma Çetin (a11y.dev)" },
      { time: "13:00", title: "Öğle Arası" },
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
  onClick: () => void;
}

const EventDayCard: React.FC<EventDayCardProps> = ({ day, title, description, onClick }) => {
  return (
    <Paper 
      elevation={0}
      onClick={onClick}
      sx={{
        p: 2,
        bgcolor: '#1f2937',
        border: '1px solid #4b5563',
        borderRadius: 2,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        boxShadow: '0 4px 6px #000000',
        '&:hover': {
          bgcolor: '#374151',
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 10px #000000',
          borderColor: '#8b5cf6'
        }
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
        <CalendarTodayIcon sx={{ color: '#8b5cf6', fontSize: 18 }} />
        <Typography 
          variant="subtitle1"
          sx={{ 
            color: '#8b5cf6',
            fontWeight: 500
          }}
        >
          {day}: {title}
        </Typography>
      </Stack>
      <Typography 
        variant="body2"
        sx={{ 
          color: '#f3f4f6',
          ml: 3.5
        }}
      >
        {description}
      </Typography>
    </Paper>
  );
};

interface EventSchedulePopupProps {
  open: boolean;
  onClose: () => void;
  daySchedule: DaySchedule;
}

const EventSchedulePopup: React.FC<EventSchedulePopupProps> = ({ open, onClose, daySchedule }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  const handleDayChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedDay(newValue);
  };

  const handleItemClick = (item: ScheduleItem) => {
    console.log('Clicked item:', item);
  };

  if (!daySchedule) return null;
    
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    bgcolor: '#1f2937',
    border: '1px solid #4b5563',
    borderRadius: '12px',
    boxShadow: '0 4px 6px #000000',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    '&:focus': {
      outline: 'none',
      bgcolor: '#1f2937',
      boxShadow: '0 6px 10px #000000',
      borderColor: '#8b5cf6'
    }
  };

  const headerStyle = {
    p: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #4b5563',
    color: '#f3f4f6'
  };

  const contentStyle = {
    backgroundImage: 'linear-gradient(#1e293b, #111827)',
    boxShadow: '0 4px 30px #000000',
    border: '1px solid #4b5563',
    borderRadius: '12px',
    overflow: 'hidden'
  };

  const closeButtonStyle = {
    minWidth: 'auto',
    p: 1,
    color: '#ffffff'
  };

  const dialogContentStyle = {
    bgcolor: 'transparent',
    borderColor: '#4b5563'
  };

  const dayButtonStyle = {
    borderBottom: '1px solid #4b5563',
    '&:hover': {
      bgcolor: '#374151'
    }
  };

  const timeSlotStyle = (isLunch: boolean) => ({
    bgcolor: isLunch ? '#000000' : 'transparent',
    color: isLunch ? '#ffffff' : '#ffffff',
    borderBottom: '1px solid #4b5563',
    '&:hover': {
      bgcolor: isLunch ? '#000000' : '#374151'
    }
  });

  const descriptionStyle = {
    color: '#ffffff',
    borderBottom: '1px solid #4b5563',
    '&:hover': {
      bgcolor: '#374151'
    }
  };

  const speakerStyle = {
    bgcolor: '#8b5cf6'
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: modalStyle
      }}
    >
      <DialogTitle sx={headerStyle}>
        <Typography variant="h6" component="div">
          {daySchedule.title}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={closeButtonStyle}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={dialogContentStyle}>
        <Box sx={contentStyle}>
          <Tabs
            value={selectedDay}
            onChange={handleDayChange}
            variant="fullWidth"
            sx={{
              borderBottom: '1px solid #4b5563',
              '& .MuiTabs-indicator': {
                backgroundColor: '#8b5cf6'
              }
            }}
          >
            {daySchedule.days.map((day) => (
              <Tab
                key={day}
                label={day}
                sx={dayButtonStyle}
              />
            ))}
          </Tabs>

          <Box sx={{ p: 2 }}>
            {daySchedule.schedule.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box
                  sx={timeSlotStyle(item.title === "Öğle Arası")}
                  onClick={() => handleItemClick(item)}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {item.time}
                  </Typography>
                  <Typography variant="body1">
                    {item.title}
                  </Typography>
                </Box>
                {item.description && (
                  <Typography
                    variant="body2"
                    sx={descriptionStyle}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.description}
                  </Typography>
                )}
                {item.speaker && (
                  <Chip
                    label={item.speaker}
                    size="small"
                    sx={speakerStyle}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default function EventSchedule() {
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
    <div className="bg-[#1f2937] backdrop-blur-sm rounded-lg p-6 mb-6 shadow-lg border border-[#4b5563]">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <EventNoteIcon sx={{ color: '#ffffff', mr: 1 }} />
        <Typography variant="h6" component="h3" sx={{ color: '#ffffff', fontWeight: 500 }}>
          Program
        </Typography>
      </Box>
      <Stack spacing={2}>
        {scheduleData.map((data, index) => (
          <EventDayCard
            key={index}
            day={data.days[0]}
            title={data.title}
            description={index === 0 ? "Yeni teknolojiler ve güncel web trendleri" : 
                        index === 1 ? "Backend ve veri yönetimi" : 
                        "Kariyer ve pratik uygulamalar"}
            onClick={() => handleDayClick(data)}
          />
        ))}
      </Stack>
      {selectedDay && (
        <EventSchedulePopup 
          open={open} 
          onClose={handleClose} 
          daySchedule={selectedDay} 
        />
      )}
    </div>
  );
} 