(define (problem scene1)
  (:domain manip)
  (:objects
    mango - item
    yellow lemon - item
    tomato - item
    plastic knife - item
    paper clip - item
  )
  (:init
    (ontable mango)
    (ontable yellow lemon)
    (ontable tomato)
    (ontable plastic knife)
    (ontable paper clip)
    (clear mango)
    (clear yellow lemon)
    (clear tomato)
    (clear plastic knife)
    (clear paper clip)
    (handempty)
  )
  (:goal (and ))
)