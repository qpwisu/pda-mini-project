from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey, DATETIME
from sqlalchemy.orm import relationship
from database import Base

# User 모델
class User(Base):
    __tablename__ = 'User'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")
    updated_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP", onupdate="CURRENT_TIMESTAMP")

    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    likes = relationship("Likes", back_populates="user", cascade="all, delete-orphan")

# News 모델
class News(Base):
    __tablename__ = 'News'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    preview = Column(Text, nullable=False)
    url = Column(String(255))
    imageURL = Column(String(255))
    content = Column(Text, nullable=False)
    published_at = Column(DATETIME)

    comments = relationship("Comment", back_populates="news", cascade="all, delete-orphan")
    likes = relationship("Likes", back_populates="news", cascade="all, delete-orphan")

# Comment 모델
class Comment(Base):
    __tablename__ = 'Comment'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"), nullable=False)
    news_id = Column(Integer, ForeignKey("News.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")
    updated_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP", onupdate="CURRENT_TIMESTAMP")

    user = relationship("User", back_populates="comments")
    news = relationship("News", back_populates="comments")

# Likes 모델
class Likes(Base):
    __tablename__ = 'Likes'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"), nullable=False)
    news_id = Column(Integer, ForeignKey("News.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")

    user = relationship("User", back_populates="likes")
    news = relationship("News", back_populates="likes")

# Term 모델
class Term(Base):
    __tablename__ = 'Term'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    term_name = Column(String(255), unique=True, nullable=False)
    description = Column(Text)
    created_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")
    updated_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP", onupdate="CURRENT_TIMESTAMP")
