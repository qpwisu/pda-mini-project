import subprocess

print("Running news-collect.py...")
subprocess.run(["python3", "news-collect.py"])
print("Finished running news-collect.py")



# Step 2: Run detail_news_api.py
print("Running detail_news_api.py...")
subprocess.run(["python3", "detail_news_api.py"])
print("Finished running detail_news_api.py")