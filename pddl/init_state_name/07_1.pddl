(define (problem scene1)
  (:domain manip)
  (:objects
    banana - item
    bunch of red grapes - item
    green apple - item
    yellow lemon - item
    green basket - container
    pink bowl - container
    pink lid - lid
  )
  (:init
    (ontable banana)
    (ontable bunch of red grapes)
    (ontable green apple)
    (in yellow lemon green basket)
    (ontable green basket)
    (on pink lid pink bowl)
    (closed pink bowl)
    (ontable pink bowl)
    (handempty)
    (clear banana)
    (clear bunch of red grapes)
    (clear green apple)
    (clear pink lid)
  )
  (:goal (and ))
)