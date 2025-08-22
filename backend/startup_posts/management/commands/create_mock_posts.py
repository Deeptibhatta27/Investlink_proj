
import random
from django.core.management.base import BaseCommand
from faker import Faker
from accounts.models import User
from startup_posts.models import StartupPost, PostComment

class Command(BaseCommand):
    help = 'Creates mock startup posts and comments'

    def handle(self, *args, **kwargs):
        fake = Faker()
        
        # Get all startup users
        startup_users = User.objects.filter(role='startup')
        if not startup_users.exists():
            self.stdout.write(self.style.ERROR('No startup users found. Please create some first.'))
            return

        # Create 4 startup posts
        for _ in range(4):
            startup_user = random.choice(startup_users)
            post = StartupPost.objects.create(
                startup=startup_user,
                content=fake.paragraph(nb_sentences=5),
            )
            self.stdout.write(self.style.SUCCESS(f'Created post for {startup_user.username}'))

            # Create comments for each post
            for _ in range(random.randint(1, 5)):
                commenter = random.choice(User.objects.all())
                PostComment.objects.create(
                    post=post,
                    user=commenter,
                    content=fake.sentence()
                )
        
        self.stdout.write(self.style.SUCCESS('Successfully created mock startup posts and comments.'))
