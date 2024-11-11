-- User Table 데이터 삽입
use news_db;


INSERT INTO User (username, email, password, created_at, updated_at) VALUES
('user1', 'user1@example.com', 'password1', '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('user2', 'user2@example.com', 'password2', '2024-01-02 10:00:00', '2024-01-02 10:00:00'),
('user3', 'user3@example.com', 'password3', '2024-01-03 10:00:00', '2024-01-03 10:00:00'),
('user4', 'user4@example.com', 'password4', '2024-01-04 10:00:00', '2024-01-04 10:00:00'),
('user5', 'user5@example.com', 'password5', '2024-01-05 10:00:00', '2024-01-05 10:00:00'),
('user6', 'user6@example.com', 'password6', '2024-01-06 10:00:00', '2024-01-06 10:00:00'),
('user7', 'user7@example.com', 'password7', '2024-01-07 10:00:00', '2024-01-07 10:00:00'),
('user8', 'user8@example.com', 'password8', '2024-01-08 10:00:00', '2024-01-08 10:00:00'),
('user9', 'user9@example.com', 'password9', '2024-01-09 10:00:00', '2024-01-09 10:00:00'),
('user10', 'user10@example.com', 'password10', '2024-01-10 10:00:00', '2024-01-10 10:00:00');

-- News Table 데이터 삽입
INSERT INTO News (title, preview, url, imageURL, content, published_at) VALUES
('News Title 1', 'Preview of news 1', 'http://example.com/1', 'http://example.com/image1.jpg', 'Content of news 1', '2024-01-01 12:00:00'),
('News Title 2', 'Preview of news 2', 'http://example.com/2', 'http://example.com/image2.jpg', 'Content of news 2', '2024-01-02 12:00:00'),
('News Title 3', 'Preview of news 3', 'http://example.com/3', 'http://example.com/image3.jpg', 'Content of news 3', '2024-01-03 12:00:00'),
('News Title 4', 'Preview of news 4', 'http://example.com/4', 'http://example.com/image4.jpg', 'Content of news 4', '2024-01-04 12:00:00'),
('News Title 5', 'Preview of news 5', 'http://example.com/5', 'http://example.com/image5.jpg', 'Content of news 5', '2024-01-05 12:00:00'),
('News Title 6', 'Preview of news 6', 'http://example.com/6', 'http://example.com/image6.jpg', 'Content of news 6', '2024-01-06 12:00:00'),
('News Title 7', 'Preview of news 7', 'http://example.com/7', 'http://example.com/image7.jpg', 'Content of news 7', '2024-01-07 12:00:00'),
('News Title 8', 'Preview of news 8', 'http://example.com/8', 'http://example.com/image8.jpg', 'Content of news 8', '2024-01-08 12:00:00'),
('News Title 9', 'Preview of news 9', 'http://example.com/9', 'http://example.com/image9.jpg', 'Content of news 9', '2024-01-09 12:00:00'),
('News Title 10', 'Preview of news 10', 'http://example.com/10', 'http://example.com/image10.jpg', 'Content of news 10', '2024-01-10 12:00:00');

-- Comment Table 데이터 삽입
INSERT INTO Comment (user_id, news_id, content, created_at, updated_at) VALUES
(1, 1, 'Comment by user1 on news1', '2024-01-01 13:00:00', '2024-01-01 13:00:00'),
(2, 2, 'Comment by user2 on news2', '2024-01-02 13:00:00', '2024-01-02 13:00:00'),
(3, 3, 'Comment by user3 on news3', '2024-01-03 13:00:00', '2024-01-03 13:00:00'),
(4, 4, 'Comment by user4 on news4', '2024-01-04 13:00:00', '2024-01-04 13:00:00'),
(5, 5, 'Comment by user5 on news5', '2024-01-05 13:00:00', '2024-01-05 13:00:00'),
(6, 6, 'Comment by user6 on news6', '2024-01-06 13:00:00', '2024-01-06 13:00:00'),
(7, 7, 'Comment by user7 on news7', '2024-01-07 13:00:00', '2024-01-07 13:00:00'),
(8, 8, 'Comment by user8 on news8', '2024-01-08 13:00:00', '2024-01-08 13:00:00'),
(9, 9, 'Comment by user9 on news9', '2024-01-09 13:00:00', '2024-01-09 13:00:00'),
(10, 10, 'Comment by user10 on news10', '2024-01-10 13:00:00', '2024-01-10 13:00:00');

-- Likes Table 데이터 삽입


-- Term Table 데이터 삽입
INSERT INTO Term (term_name, description, created_at, updated_at) VALUES
('Term1', 'Description of Term1', '2024-01-01 15:00:00', '2024-01-01 15:00:00'),
('Term2', 'Description of Term2', '2024-01-02 15:00:00', '2024-01-02 15:00:00'),
('Term3', 'Description of Term3', '2024-01-03 15:00:00', '2024-01-03 15:00:00'),
('Term4', 'Description of Term4', '2024-01-04 15:00:00', '2024-01-04 15:00:00'),
('Term5', 'Description of Term5', '2024-01-05 15:00:00', '2024-01-05 15:00:00'),
('Term6', 'Description of Term6', '2024-01-06 15:00:00', '2024-01-06 15:00:00'),
('Term7', 'Description of Term7', '2024-01-07 15:00:00', '2024-01-07 15:00:00'),
('Term8', 'Description of Term8', '2024-01-08 15:00:00', '2024-01-08  15:00:00');
-- news_like Table 데이터 삽입
INSERT INTO news_like (user_id, news_id, created_at) VALUES
(1, 1, '2024-01-01 14:00:00'),
(2, 2, '2024-01-02 14:00:00'),
(3, 3, '2024-01-03 14:00:00'),
(4, 4, '2024-01-04 14:00:00'),
(5, 5, '2024-01-05 14:00:00'),
(6, 6, '2024-01-06 14:00:00'),
(7, 7, '2024-01-07 14:00:00'),
(8, 8, '2024-01-08 14:00:00'),
(9, 9, '2024-01-09 14:00:00'),
(10, 10, '2024-01-10 14:00:00');

-- term_like Table 데이터 삽입
INSERT INTO term_like (user_id, term_id, created_at) VALUES
(1, 1, '2024-01-01 15:00:00'),
(2, 2, '2024-01-02 15:00:00'),
(3, 3, '2024-01-03 15:00:00'),
(4, 4, '2024-01-04 15:00:00'),
(5, 5, '2024-01-05 15:00:00'),
(6, 6, '2024-01-06 15:00:00'),
(7, 7, '2024-01-07 15:00:00'),
(8, 8, '2024-01-08 15:00:00'),
(9, 9, '2024-01-09 15:00:00'),
(10, 10, '2024-01-10 15:00:00');

