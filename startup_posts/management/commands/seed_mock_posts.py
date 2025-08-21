from django.core.management.base import BaseCommand
from faker import Faker
from django.contrib.auth import get_user_model
from startup_posts.models import StartupPost, PostComment
import random

fake = Faker()

class Command(BaseCommand):
    help = 'Creates mock startup posts and comments'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        
        # Get all startup users
        startup_users = User.objects.filter(role='startup')
        investor_users = User.objects.filter(role='investor')
        all_users = User.objects.all()

        if not startup_users.exists():
            self.stdout.write(self.style.ERROR('No startup users found. Please run seed_test_data first.'))
            return

        self.stdout.write('Creating mock posts and comments...')

        # Sample post content templates
        post_templates = [
            "Excited to announce our latest milestone: {achievement}! {impact}",
            "Just closed our {round_type} funding round! {gratitude}",
            "New partnership alert! 🤝 We've teamed up with {partner} to {goal}",
            "Product Update: {feature} is now live! {benefit}",
            "Proud to share that {metric} {growth}",
            "Looking for talented {role} to join our growing team! {pitch}"
        ]

        achievements = [
            "reached 100K users",
            "launched in 5 new markets",
            "secured major enterprise clients",
            "achieved 300% YoY growth",
            "received industry recognition"
        ]

        funding_rounds = ["Seed", "Series A", "Series B", "bridge"]
        gratitude_notes = [
            "Thanks to our amazing investors and team!",
            "Grateful for the support of our community!",
            "Excited for this next chapter!",
            "Ready to scale our impact!"
        ]

        partners = ["Microsoft", "AWS", "Google Cloud", "IBM", "Oracle", "Salesforce"]
        goals = [
            "enhance our AI capabilities",
            "scale our infrastructure",
            "expand market reach",
            "improve user experience",
            "develop new features"
        ]

        features = [
            "AI-powered analytics",
            "real-time collaboration",
            "automated workflows",
            "integrated payments",
            "advanced reporting"
        ]

        benefits = [
            "Helping businesses save 50% more time",
            "Making data accessible to everyone",
            "Revolutionizing how teams work",
            "Simplifying complex workflows"
        ]

        metrics = [
            "our customer satisfaction score",
            "our platform uptime",
            "our processing speed",
            "our user engagement"
        ]

        growth_stats = [
            "has increased by 200%",
            "is now industry-leading",
            "exceeds market standards",
            "shows promising growth"
        ]

        roles = ["Senior Developer", "AI Engineer", "Product Manager", "Sales Lead", "UX Designer"]
        pitches = [
            "Join us in revolutionizing the industry!",
            "Be part of our fast-growing team!",
            "Help us shape the future!",
            "Competitive benefits and great culture!"
        ]

        # Create 5-10 posts for each startup
        for startup in startup_users:
            num_posts = random.randint(5, 10)
            for _ in range(num_posts):
                template = random.choice(post_templates)
                content = template.format(
                    achievement=random.choice(achievements),
                    round_type=random.choice(funding_rounds),
                    gratitude=random.choice(gratitude_notes),
                    partner=random.choice(partners),
                    goal=random.choice(goals),
                    feature=random.choice(features),
                    benefit=random.choice(benefits),
                    metric=random.choice(metrics),
                    growth=random.choice(growth_stats),
                    role=random.choice(roles),
                    pitch=random.choice(pitches)
                )

                post = StartupPost.objects.create(
                    startup=startup,
                    content=content
                )

                # Add random likes
                num_likes = random.randint(5, 20)
                likers = random.sample(list(all_users), min(num_likes, all_users.count()))
                post.likes.set(likers)

                # Add 3-7 comments on each post
                num_comments = random.randint(3, 7)
                for _ in range(num_comments):
                    commenter = random.choice(list(all_users))
                    comment_templates = [
                        "Great update! Looking forward to seeing {expectation}",
                        "Congratulations on {achievement}! {sentiment}",
                        "This is amazing! {praise}",
                        "Interesting development! {question}",
                        "Fantastic progress! {encouragement}"
                    ]
                    
                    expectations = [
                        "more innovations from your team",
                        "the impact of this development",
                        "how this scales",
                        "future updates"
                    ]
                    
                    sentiments = [
                        "Well deserved!",
                        "Keep up the great work!",
                        "The future looks bright!",
                        "This is just the beginning!"
                    ]
                    
                    praise = [
                        "Your team is doing incredible work.",
                        "This is game-changing for the industry.",
                        "Such innovative thinking!",
                        "Setting new standards!"
                    ]
                    
                    questions = [
                        "Any plans for international expansion?",
                        "How does this compare to existing solutions?",
                        "What's next on your roadmap?",
                        "Will this be available for early access?"
                    ]
                    
                    encouragement = [
                        "Keep innovating!",
                        "Can't wait to see what's next!",
                        "You're making waves!",
                        "Leading the way!"
                    ]

                    comment_template = random.choice(comment_templates)
                    comment_content = comment_template.format(
                        expectation=random.choice(expectations),
                        achievement=random.choice(achievements),
                        sentiment=random.choice(sentiments),
                        praise=random.choice(praise),
                        question=random.choice(questions),
                        encouragement=random.choice(encouragement)
                    )

                    PostComment.objects.create(
                        post=post,
                        user=commenter,
                        content=comment_content
                    )

        self.stdout.write(self.style.SUCCESS('Successfully created mock posts and comments'))
