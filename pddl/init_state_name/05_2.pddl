(define (problem scene1)
  (:domain manip)
  (:objects
    tomato - item
    red onion - item
    purple eggplant - item
    small orange carrot - item
    water bottle - item
    big yellow shopping basket - container
  )
  (:init
    (ontable tomato)
    (ontable red onion)
    (ontable small orange carrot)
    (ontable water bottle)
    (in purple eggplant big yellow shopping basket)
    (handempty)
    (clear tomato)
    (clear red onion)
    (clear small orange carrot)
    (clear water bottle)
  )
  (:goal (and ))
)